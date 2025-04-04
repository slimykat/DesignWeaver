import React, { useState } from "react";
import "../styles/param-section.css";
import PromptPanel from "./PromptPanel";

const ParamSection_Baseline = ({ attributes, setAttributes , loading, setLoading}) => {
  return (
    <div className="param-section">
      <div className="param-section-title">Write prompts to generate product designs</div>

      <PromptPanel
        attributes={attributes}
        setAttributes={setAttributes}
        categories={[]}
        loading={loading}
        setLoading={setLoading}
        // baseline would not use categories
      ></PromptPanel>
    </div>
  );
};

export default ParamSection_Baseline;
