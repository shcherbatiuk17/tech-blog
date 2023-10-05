document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-post");
  const editButtons = document.querySelectorAll(".edit-description");
  const newPostForm = document.querySelector(".new-post-form");

  const handleDeleteClick = async (postId) => {
    try {
      const response = await fetch(`/api/blogposts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        console.error("Delete request failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = async (postId) => {
    const editedTitle = document.querySelector(`#edit-title-${postId}`).value;
    const editedDescription = document.querySelector(`#edit-description-${postId}`).value;
    console.log(editedDescription);
    try {
      const response = await fetch(`/api/blogposts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        console.error("Edit submission failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewPostSubmit = async (event) => {
    event.preventDefault();

    const user_id = newPostForm.getAttribute("data-user-id");
    const title = document.querySelector("#post-title").value.trim();
    const description = document.querySelector(".post-description").value;

    if (title && description) {
      try {
        const response = await fetch(`/api/blogposts`, {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            user_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          document.location.replace("/dashboard");
        } else {
          alert("Failed to create post, title and description required");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.getAttribute("data-post-id");
      handleDeleteClick(postId);
    });
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.getAttribute("data-post-id");
      handleEditClick(postId);
    });
  });

  newPostForm.addEventListener("submit", handleNewPostSubmit);
});