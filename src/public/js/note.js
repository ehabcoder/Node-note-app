const local_url = "http://localhost:3000"


fetch(`http://localhost:3000/notes`, {
    method: 'GET',
    headers: {
        'Content-type': 'application/json',
        'Authorization': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoid2VzYWxAZ21haWwuY29tIiwiaWF0IjoxNjYzNDA0MjY0fQ.O8Af36ajw2VtKGUi_yrwmH6-LkX61u6ZoGgpvjscwF8`, // notice the Bearer before your token
    },
})
.then(res => res.json())
.then(data => console.log(data))