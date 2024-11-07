document.addEventListener('DOMContentLoaded', function () {
  const deleteButtons = document.querySelectorAll('#deleteEmailsButton, #deleteSentEmailsButton');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const form = event.target.closest('form');
      const selectedEmails = Array.from(form.elements['selectedEmails'])
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

      if (selectedEmails.length === 0) {
        alert("Please select at least one email to delete.");
        return;
      }

      for (const emailId of selectedEmails) {
        try {
          const response = await fetch(`/api/delete-email/${emailId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error("Failed to delete email");
          }
        } catch (error) {
          console.error("Error deleting email:", error);
          alert("An error occurred while deleting emails.");
        }
      }

      // Xóa các email đã chọn khỏi giao diện
      selectedEmails.forEach(emailId => {
        const emailItem = form.querySelector(`input[value="${emailId}"]`).closest('.email-item');
        if (emailItem) {
          emailItem.remove();
        }
      });

      alert("Selected emails have been deleted successfully.");
    });
  });
});
