document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const nameExistMessage = document.getElementById('name-exist-message');
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      const nameInputValue = this.value.toUpperCase();
      this.value = nameInputValue;

      // Retrieve stored students data from localStorage
      const studentsData = JSON.parse(localStorage.getItem('studentsData') || '[]');
      const studentNames = studentsData.map(student => student['Name of the Student'].toUpperCase());

      const nameExistMessage = document.getElementById('name-exist-message');
      if (studentNames.includes(nameInputValue)) {
        nameExistMessage.textContent = 'Name exists in the database.';
        nameExistMessage.style.color = 'green';
      } else {
        nameExistMessage.textContent = 'Name does not exist in the database. Please recheck the above process.';
        nameExistMessage.style.color = 'red';

      }
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.querySelector('form');
    if (registrationForm) {
      registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
  
        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
          console.log('Form submitted successfully:', result);
          alert('Form submitted successfully!');
        })
        .catch(error => console.error('Error:', error));
      });
    }
  });
  
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      fetch('/validateName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        if (result.valid) {
          alert('Name validated successfully!');
          // Optionally, redirect or perform another action
        } else {
          alert('Name validation failed. Please check your details.');
        }
      })
      .catch(error => console.error('Error:', error));
      fetch('/submitForm', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        alert('Form submitted successfully!');
      })
      .catch(error => console.error('Error:', error));
    });
  }
});
