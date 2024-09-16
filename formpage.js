document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('page-form');

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      const yearOfStudy = document.getElementById('year-of-study').value;
      const department = document.getElementById('department').value;
      const section = document.getElementById('sec').value;

      fetch('http://localhost:3020/fetchStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: yearOfStudy,
          department: department,
          section: section
        })
      })
      .then(response => response.json())
      .then(students => {
        // Store fetched students in localStorage for validation in the next form
        localStorage.setItem('studentsData', JSON.stringify(students));
        
        // Redirect to the next form
        window.location.href = 'http://localhost:3000';
      })
      .catch(error => console.error('Error:', error));
    });
  }
});
