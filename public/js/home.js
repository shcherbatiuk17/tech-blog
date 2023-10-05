document.addEventListener("DOMContentLoaded", () => {
  const commentButtons = document.querySelectorAll(".submit-comment");

  const handleCommentSubmission = async (button) => {
    const blogpostId = button.getAttribute("data-blogpost-id");
    const commentInput = document.querySelector(`#commentText-${blogpostId}`);
    const userId = button.getAttribute("data-user-id");

    try {
      const commentText = commentInput.value;
      const response = await fetch(`/api/comments/blogpost/${blogpostId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentText,
          user_id: userId, // Use userId here
          blogpost_id: blogpostId,
        }),
      });

      if (response.ok) {
        // Comment submission successful, update UI as needed
        document.location.replace('/'); // Reload the page to reflect the new comment
      } else {
        console.error("Comment submission failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  commentButtons.forEach(button => {
    button.addEventListener("click", () => {
      handleCommentSubmission(button);
    });
  });
});
