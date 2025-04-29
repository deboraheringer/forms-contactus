const form = document.querySelector('#contact-form')
const inputs = {
  firstName: document.querySelector('#first-name-input'),
  lastName: document.querySelector('#last-name-input'),
  email: document.querySelector('#email-input'),
  message: document.querySelector('#message'),
  consent: document.querySelector('#consent'),
  queryType: document.querySelectorAll('input[name="query-type"]'),
}

const errorSelectors = {
  firstName: '#first-name-error',
  lastName: '#last-name-error',
  email: '#email-error',
  queryType: '#query-type-error',
  message: '#message-error',
  consent: '#consent-error',
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(e.target)

  const {
    'first-name': firstName,
    'last-name': lastName,
    email,
    'query-type': queryType = '',
    message,
    consent,
  } = Object.fromEntries(data.entries())

  resetErrors()

  const errors = validateForm({ firstName, lastName, email, queryType, message, consent })
  if (errors.length) {
    errors.forEach(showError)
  } else {
    onSuccess(data)
  }
})

function validateForm({ firstName, lastName, email, queryType, message, consent }) {
  const errors = []
  if (!firstName) errors.push('firstName')
  if (!lastName) errors.push('lastName')
  if (!email) errors.push('email')
  if (!queryType) errors.push('queryType')
  if (!message) errors.push('message')
  if (!consent) errors.push('consent')
  return errors
}

function resetErrors() {
  Object.values(errorSelectors).forEach(hideError)
}

function showError(field) {
  const selector = errorSelectors[field]
  if (selector) document.querySelector(selector).style.display = 'block'
}

function hideError(selector) {
  document.querySelector(selector).style.display = 'none'
}

function onSuccess(data) {
  const alert = document.querySelector('.alert')
  alert.style.display = 'block'

  setTimeout(() => {
    alert.style.display = 'none'
  }, 5000)

  console.log([...data.values()])

  Object.entries(inputs).forEach(([key, input]) => {
    if (key === 'queryType') {
      input.forEach((radio) => (radio.checked = false))
    } else if (input.type === 'checkbox') {
      input.checked = false
    } else {
      input.value = ''
    }
  })
}

Object.entries(inputs).forEach(([key, input]) => {
  const type = input.type

  if (key === 'queryType') {
    input.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          hideError(errorSelectors['queryType'])
        }
      })
    })
  } else if (type === 'checkbox') {
    input.addEventListener('change', () => {
      if (input.checked) {
        hideError(errorSelectors['consent'])
      }
    })
  } else {
    input.addEventListener('input', () => {
      if (input.value.trim() === '') {
        showError(key)
      } else {
        hideError(errorSelectors[key])
      }
    })
  }
})
