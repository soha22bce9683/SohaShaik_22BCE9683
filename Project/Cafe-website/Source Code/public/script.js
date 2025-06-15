let token = localStorage.getItem('token') || '';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        username: signupUsername.value,
        email: signupEmail.value,
        password: signupPassword.value
      };
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.message);
      signupForm.reset();
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.value,
          password: loginPassword.value
        })
      });
      const result = await res.json();
      alert(result.message);
      if (res.ok) {
        token = result.token;
        localStorage.setItem('token', token);
        window.location.href = '/menu.html';
      }
    });
  }

  const menuContainer = document.getElementById('menuContainer');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const totalElement = document.getElementById('total');

  if (menuContainer) {
    fetch('/menu')
      .then(res => res.json())
      .then(data => {
        data.forEach(item => {
          const div = document.createElement('div');
          div.className = 'menu-item';
          div.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" />
            <h4>${item.name}</h4>
            <p>₹${item.price}</p>
            <input type="number" min="0" value="0" data-id="${item._id}" data-price="${item.price}" />
          `;
          menuContainer.appendChild(div);
        });
      })
      .catch(err => console.error('Menu load failed:', err));

    menuContainer.addEventListener('input', () => {
      let total = 0;
      menuContainer.querySelectorAll('input[type="number"]').forEach(input => {
        const qty = parseInt(input.value || 0);
        const price = parseFloat(input.dataset.price);
        if (!isNaN(qty) && !isNaN(price)) total += qty * price;
      });
      totalElement.textContent = total;
    });

    placeOrderBtn.addEventListener('click', async () => {
      const items = [];
      let total = 0;
      menuContainer.querySelectorAll('input[type="number"]').forEach(input => {
        const qty = parseInt(input.value);
        if (qty > 0) {
          const id = input.dataset.id;
          const price = parseFloat(input.dataset.price);
          total += qty * price;
          items.push({ itemId: id, quantity: qty });
        }
      });

      if (items.length === 0) return alert('Select at least one item.');

      try {
        const res = await fetch('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ items, total })
        });
        const result = await res.json();
        alert(result.message);
      } catch (e) {
        console.error('Order failed:', e);
        alert('Order error.');
      }
    });
  }
});
