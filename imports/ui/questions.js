import React from "react";
import { withRouter } from "react-router-dom";

class questions extends React.Component{
  render(){
    return(
      <div>
        <h1>Image Url</h1>
        <hr />
        <h3>What is an image url?</h3>
        <p>An image URL is an internet address that points directly to a
        specific image, base than an entire index, webpage or website.
        Image URLs typically include the image filename.</p>
        <h3>How do I upload my Note using an image URL?</h3>
        <p>To do this is simple, just follow these steps.  </p>
        <ol>
          <li>Open a browser window and go to the page containing the image you want to use in Benchmark Email.</li>
          <li>Move your mouse over the image and right-click the mouse button.</li>
          <li>Select 'Copy image address' from the pop-up menu.</li>
          <li>Paste the url in the image URL box using the right-click on the mouse button.</li>
          <li>Click the add button to add the note.</li>
          <li>Ta-da!</li>
        </ol>
      </div>
    )
  }
}

export default withRouter(questions)
