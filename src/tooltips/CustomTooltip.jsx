import React from 'react';

const CustomTooltip = ({ content, isHtml }) => {
  if (isHtml) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  } else {
    return <div>{content}</div>;
  }
};

export default CustomTooltip;
