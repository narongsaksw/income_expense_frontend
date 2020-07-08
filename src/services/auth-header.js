export default function authHeader() {
    const token = JSON.parse(localStorage.getItem('user'));
    if (token) {
      return { 'x-auth-token': token };
    } else {
      return {};
    }
  }
  