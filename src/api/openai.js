import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getRecommendedOptions(currentCategory) {
  const systemMessage = {
    role: "system",
    content:
      "You are a helpful assistant that provides concise 5 distinct design recommendations based on existing design tags for dining room chair design.",
  };

  const userMessage = {
    role: "user",
    content: `Based on the current design tags in the category "${currentCategory.name}", suggest 5 new distinct design options. Please provide a simple list of options separated by commas and nothing else. Don't add numbers or bullet points.`,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [systemMessage, userMessage],
    max_tokens: 50,
  });

  const recommendedOptions = response.choices[0].message.content
    .trim()
    .split(",")
    .map((option) => option.trim().replace(/"/g, ""));
  return recommendedOptions;
}

export async function getRecommendedDimensions(currentCategories) {
  const systemMessage = {
    role: "system",
    content:
      "You are a helpful assistant that provides concise design recommendations based on existing design dimensions for dining room chair design.",
  };

  const categoriesList = currentCategories
    .map((category) => category.name)
    .join(", ");

  const userMessage = {
    role: "user",
    content: `Based on the current design dimensions: [${categoriesList}], suggest 5 new distinct dimensions. Please provide a simple list of dimensions separated by commas and nothing else. Don't add numbers or bullet points.`,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [systemMessage, userMessage],
    max_tokens: 50,
  });

  const recommendedDimensions = response.choices[0].message.content
    .trim()
    .split(",")
    .map((dimension) => dimension.trim().replace(/"/g, ""));
  return recommendedDimensions;
}

export async function imageGenerate(
  prompt_text,
  num = 3,
  size = "1024x1024",
  quality = "standard",
  callback = null
) {
  let promises = [];

  for (let i = 0; i < num; i++) {
    promises.push(
      openai.images
        .generate({
          model: "dall-e-3",
          prompt: prompt_text,
          n: 1,
          size: String(size), // Ensure size is a string
          quality: quality,
        })
        .then(async (response) => {
          if (callback) {
            if (callback.constructor.name === "AsyncFunction") {
              await callback(response.data[0].url, i);
            } else {
              callback(response.data[0].url, i);
            }
          }
          return response.data[0].url;
        })
    );
  }

  const responses = await Promise.all(promises);

  return responses;
}

export async function convertTagsToPrompt(oldTags, newTags, promptText) {
  const systemMessage = {
    role: "system",
    content:
      "You are a design generalist that converts design tags and weights into descriptive prompts. Your task is to update the prompt according to the given old and new tags comparison and their corresponding weights, making sure to remove any references to tags that have been removed or neutralized (weight = 0). Preserve as much of the original prompt as possible, but reflect all tag changes accurately.",
  };

  function transformTags(tags) {
    return tags.map((tag) => ({
      name: tag.name,
      tags: tag.options.map((option) => ({
        tag: option.optionName,
        weight: option.scale,
      })),
    }));
  }

  const transformedNewTags = transformTags(newTags);
  const transformedOldTags = transformTags(oldTags);

  const userMessage = {
    role: "user",
    content: `Update the old prompt by comparing the old and new tags and weights pairs. Any tags with a weight of 0 should be removed from the prompt. Any tags with a weight of 1 should be included in the prompt. 
              New Tags: ${JSON.stringify(transformedNewTags)}
              Old Tags: ${JSON.stringify(transformedOldTags)}
              Old Prompt: "${promptText}"
              Just return the prompt itself. Use complete sentences to describe the design.`,
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, userMessage],
    max_tokens: 2000,
  });

  let updatedPrompt = response.choices[0].message.content.trim();

  // Remove leading and trailing double quotes if they exist
  if (updatedPrompt.startsWith('"') && updatedPrompt.endsWith('"')) {
    updatedPrompt = updatedPrompt.substring(1, updatedPrompt.length - 1);
  }

  return updatedPrompt;
}

export async function convertImageToTags(url, cur_categories) {
  const JSON_prompt = cur_categories.map((category) => {
    return {
      name: category.name,
      tags: category.options.map((option) => {
        return option.optionName;
      }),
    };
  });
  console.log(JSON_prompt);
  const system_message = {
    role: "system",
    content:
      "You are a creative and helpful designer who assists in identifying and categorizing aesthetic dimensions of product designs. The response should be format like: {newtags:[{'name':'Dimention Name', 'tags':['tag1', 'tag2', 'tag3' ... }]}",
  };
  // ensure the response JSON follows the format of JSON_prompt

  const text_prompt =
    "What relevant aesthetic dimensions and design element tags are in this image? Reference the existing tags and think outside the box and include all relevant dimensions.\
     On top of the old tags, generate 1-5 new tags that either append to existing design dimensions or create new dimensions while avoiding from creating similar dimensions to the old ones. Provide the output in a JSON format." +
    JSON.stringify(JSON_prompt);
  const user_message = {
    role: "user",
    content: [
      {
        type: "text",
        text: text_prompt,
      },
      {
        type: "image_url",
        image_url: {
          url: url,
          detail: "low",
        },
      },
    ],
  };
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [system_message, user_message],
    max_tokens: 3000,
  });
  return JSON.parse(response.choices[0].message.content)["newtags"];
}
