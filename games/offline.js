function check() {
  fetch('offline.json')
    .then(response => response.json())
    .then(data => {
      if (data.offline === true) {
        window.location.href = 'offline.html';
      }
    })
    .catch(error => {
      console.error('Error fetching JSON:', error);
    });
}

check();