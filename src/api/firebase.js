////  Firebase api
// import React ,{useState} from 'react'
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  push,
  update,
} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime database
const db = getDatabase(app);

export async function setUserData(userID, key, value) {
  const path = `participants/${userID}/${key}`;
  return await writeDatabase(path, value);
}

export async function getUserData(userID) {
  const path = `participants/${userID}`;
  return await readDatabase(path);
}
// Download the image to storage (through backend)
export async function tempUrlToStorage(imageUrl) {
  // console.log("DEBUG: backend not working now");
  // return imageUrl;
  return await fetch(
    process.env.REACT_APP_BACKEND_URL + "/downloadImage?url=" + imageUrl,
    {
      // mode: "cors", // Allows cross-origin requests with CORS
      encoding: null, // Keeps the response body as a raw binary buffer
    }
  )
    .then(res => res.json()).then(data => {
      const trueUrl = data.url;
      console.log("Image uploaded successfully:", trueUrl);
      return trueUrl;
    })
    .catch((error) => {
      console.error("Error:", error);
      return "";
    });
}

// DB Core functions
export async function writeDatabase(path, data) {
  await set(ref(db, path), data).then((error) => {
    if (error) {
      alert("Data could not be set." + error);
      return -1;
    } else {
      console.log("Data set successfully.");
      return 0;
    }
  });
}

export const updateDatabase = async (path, data) => {
  return await update(ref(db, path), data).then((error) => {
    if (error) {
      console.log("Data could not be set." + error);
      return false;
    } else {
      console.log("Data set successfully.");
      return true;
    }
  });
};

export async function pushDatabase(path, data) {
  return await push(child(ref(db), path), data).then((newRef) => {
    console.log("Data pushed successfully.");
    return newRef.key;
  });
}

export async function readDatabase(target) {
  const reference = ref(db, `${target}/`);
  const snapshot = await get(reference);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  console.log("No data available at ", target);
  return "";
}

// get all image id from one user synchronously
export const get_all_images_id = (userID) => {
  console.log("loading all image", userID);
  // let result = []
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://styleguide-c2cef-default-rtdb.firebaseio.com/participants/" +
      userID +
      "/images.json",
    false
  );
  xhr.send(null);
  if (xhr.status === 200) {
    let data = JSON.parse(xhr.responseText);
    // for(let i = 0; i < data.length; i++){
    //   data[i].map((id) => {result.push(id)})
    // }
    console.log("receive images", data);
    // console.log(result)
    if (data == "" || data == null) {
      return [];
    }
    return data;
  } else {
    throw new Error("Request failed: " + xhr.statusText);
  }

  // const path = `participants/${userID}/images`
  // const reference = ref(db, `${path}`);
  // const data = get(reference).then((snapshot) => {
  //   return snapshot.val();
  // });
  // console.log("data: ", data)
  // // .val();
  // if (data==''){
  //   return []
  // }else{
  //   return data
  // }
};

export const get_image_attributes = async (imgID) => {
  const path = `Image_pool/${imgID}`;
  const reference = ref(db, `${path}`);
  const data = await get(reference).then((snapshot) => {
    return snapshot.val();
  });
  return data;
};

export const load_image_fromIndex = async (index, userID) => {
  const path = `participants/${userID}/images/${index}`;
  // console.log(path)
  let result = await readDatabase(path).then(async (data) => {
    if (data == "") {
      console.log("No data available at ", path);
      return "";
    } else {
      return await get_image_attributes(data, userID);
    }
    // result.push(temp_result)
  });
  console.log("result: ", result);
  return result;
};


export const StoreImageURL = async (index, data, userID) => {
  return await pushDatabase("Image_pool/", data).then(async (imgID) => {
    console.log("push to pool success");

    return await writeDatabase(
      `participants/${userID}/images/${index}`,
      imgID
    ).then((err) => {
      if (err) {
        console.log("store to user failed");
        return true;
      } else {
        console.log("store to user success");
        return false;
      }
    });
  });
};

////deprecated codes
// export async function Pipe_Prompt2Images(promptText, num = 3, Model = 3) {
//   console.log("wating...");
//   let full_prompt = "Create a product rendering image of a living room chair that stands out prominently against a white background. "
//   full_prompt += promptText;
//   return await imageGenerate(full_prompt, num, Model);
// }

export const load_Image = async (iterate, userID) => {
  let result = [];
  for (let it = 0; it < 3; ++it) {
    if (iterate - it - 1 >= 0) {
      const path = `participants/${userID}/images/${iterate - it - 1}`;
      // console.log(path)
      await readDatabase(path).then(async (data) => {
        if (data == "") {
          console.log("No data available at ", path);
          // return []
        } else {
          let promises = data.map((id) => {
            // console.log("promise: " + id)
            return readDatabase("Image_pool/" + id);
          });
          const buckets = await Promise.all(promises);
          console.log("bucket: ", buckets);
          // var images_temp = []
          for (let i = 0; i < buckets.length; ++i) {
            result.push({
              id: i + 1 + 3 * it,
              src: buckets[i]["url"],
              alt: "Image " + (i + 1 + 3 * it),
            });
          }
          // return images_temp
        }
      });
      // result.push(temp_result)
    }
  }
  console.log("result: ", result);
  return result;
};
export const _StoreImageURL = async (
  urls,
  data,
  iterate_N = "-1",
  userID = "TestUser"
) => {
  // let array = urls.map((url) => {return {'url':url, 'prompt':data}})
  let updates = [];
  let promises = [];
  for (let i = 0; i < urls.length; ++i) {
    const D = { prompt: data, url: urls[i] };
    promises.push(
      pushDatabase("Image_pool/", D).then((imgID) => {
        console.log("push to pool success");
        updates.push(imgID);
      })
    );
  }
  return await Promise.all(promises).then(() => {
    return writeDatabase(
      `participants/${userID}/images/${iterate_N}`,
      updates
    ).then((err) => {
      if (err) {
        console.log("store to user failed");
        return false;
      } else {
        console.log("store to user success");
        return true;
      }
    });
  });
};
