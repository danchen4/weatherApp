(function () {
  const weatherForm = document.querySelector('form');
  const search = document.querySelector('input');
  const messageOne = document.querySelector('#message-1');
  const messageTwo = document.querySelector('#message-2');

  async function submit(e) {
    e.preventDefault();

    const location = search.value;

    messageOne.textContent = 'Loading...';
    messageTwo.textContent = '';

    try {
      const response = await fetch('/weather?address=' + location);
      const data = await response.json();
      if (data.error) {
        messageOne.textContent = data.error;
      } else {
        messageOne.textContent = data.location;
        messageTwo.textContent = data.forecast;
      }
    } catch (err) {
      messageOne.textContent = err;
    }
  }

  weatherForm.addEventListener('submit', submit);
})();
