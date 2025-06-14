document.addEventListener('DOMContentLoaded', async () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        username: document.getElementById('signupUsername').value,
        email: document.getElementById('signupEmail').value,
        password: document.getElementById('signupPassword').value
      };

      try {
        const res = await fetch('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message);
        signupForm.reset();
      } catch (err) {
        alert('Failed to sign up.');
      }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      };

      try {
        const res = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message || 'Logged in successfully');

        if (res.ok) window.location.href = '/menu.html';
      } catch (err) {
        alert('Failed to log in.');
      }
    });
  }

  const menuSelect = document.getElementById('menuSelect');
  if (menuSelect) {
    try {
      const res = await fetch('/menu');
      const items = await res.json();

      items.forEach(item => {
        const option = document.createElement('option');
        option.value = item._id;
        option.textContent = `${item.name} - ₹${item.price}`;
        menuSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Failed to load menu items');
    }
  }

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const itemId = menuSelect.value;
      const quantity = parseInt(document.getElementById('quantity').value);

      try {
        const res = await fetch('/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ itemId, quantity }] })
        });

        const data = await res.json();
        alert(data.message || 'Order placed!');
        orderForm.reset();
      } catch (err) {
        alert('Order failed.');
      }
    });
  }
});
