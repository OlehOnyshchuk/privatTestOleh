  let URL = 'https://jsonplaceholder.typicode.com/posts/';
  let selectRow = null;

  /**
  * Update information about a specific post.
  * @function
  * @name updatePost
  * @returns {Object}
  */
  function updatePost(postId, title) {
  const updatedPost = {
  title: title
};

  fetch(URL + `${postId}`, {
  method: 'PUT',
  headers: {
  'Content-Type': 'application/json',
},
  body: JSON.stringify(updatedPost),
})
  .then(response => response.json())
  .then(data => {
  displayResult('Post updated:', data);
})
  .catch(error => {
  displayResult('Error updating post:', error, true);
});
}

  // Trigger the modal when clicking the "Edit" button
  document.querySelector("#table-list").addEventListener("click", (e) => {
    let target = e.target;
    if (target.classList.contains("edit")) {
      selectRow = target.parentElement.parentElement;
      const editTitleInput = document.querySelector("#editTitle");
      editTitleInput.value = selectRow.children[0].textContent; // Assuming the Title is in the 1st column
      $("#editModal").modal("show");

    }
  });

  // Save the edited title when clicking the "Save changes" button
  document.querySelector("#saveEditTitle").addEventListener("click", () => {
    const userId = selectRow.children[2].textContent; // Assuming the User Id is in the third column
    const title = document.querySelector("#editTitle").value;

    // Call the updatePost method
    updatePost(userId, title);

    // Update the UI with the edited title
    selectRow.children[0].textContent = title;
    $("#editModal").modal("hide"); // Hide the modal
    showAlert("Title Edited", "success");
  });


  /**
  * Get information about a specific post.
  * @function
  * @name getPost
  * @returns {Object}
  */
  function getPost(userId) {
    fetch(URL + `${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        showAlert('Post information: ', "succses", data);
      })
      .catch(error => {
        showAlert('Error getting post information:', "danger", error);
      });
  }

  document.querySelector("#table-list").addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("get")) {
      const userId = selectRow.children[2].textContent;
      getPost(userId);
      showAlert("Data Fetched", "success");
    }
  });


  /**
   * Create a new post.
   * @function
   * @name createPost
   * @returns {Object}
   */
  document.querySelector("#post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const body = document.querySelector("#body").value;
    const userId = document.querySelector("#userId").value;

    if (selectRow == null) {
      // Create post object using form values
      const post = {
        title: title,
        body: body,
        userId: userId,
      };

      fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })
        .then(response => response.json())
        .then(data => {
          // Update the UI with the new post data
          const list = document.querySelector("#table-list");
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${data.title}</td>
          <td>${data.body}</td>
          <td>${data.userId}</td>
          <td>${data.id}</td>
          <td>
            <a href="#" class="btn btn-success btn-sm get">Get</a>
            <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
            <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
          </td>
        `;
          list.appendChild(row);
          selectRow = null;
          showAlert("Post Added", "success");
        })
        .catch(error => {
          // Handle error if needed
          showAlert("Error", "danger", error);
        });
    }
  });

  /**
   * Remove a post.
   * @function
   * @name removePost
   * @returns {string}
   */
  document.querySelector("#table-list").addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
      const userId = target.closest("tr").children[2].textContent;
      removePost(userId);
      showAlert("Data Deleted", "danger");
    }
});
  function removePost(postId) {
    fetch(URL + `${postId}`, {
      method: 'DELETE',
    })
      .catch(error => {
        showAlert('Error removing post:',"danger", error);
      });
  }


  /**
   * Alert.
   * @function
   * @name showAlert
   * @returns {String}
   */
  function showAlert(message, className){
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(message));
    const container  = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);

    setTimeout(() => document.querySelector(".alert").remove(), 4000)
  }

