import * as ReactDOM from 'react-dom'

export function addFormValidation(inputs: any[], revalidate: (input: any) => void) {
  for (let input of inputs) {
    input.addEventListener('input', event => revalidate(event.target))

    input.addEventListener('invalid', (event) => {
      const input: any = event.target;
      input.closest('.form-group').classList.add('has-error')
    })
  }
}

export function resetFormValidationErrors(inputs: any[]) {
  inputs.forEach(input => input.closest('.form-group') !.classList.remove('has-error'))
}

export function getInputs(component) {
  return [...ReactDOM.findDOMNode(component).querySelectorAll('input,textarea')]
}

export function revalidateInput(input: any) {
  input.closest('.form-group').classList.remove('has-error')
  setTimeout(() => input.checkValidity())
}

export function enableTypeaheadFeatures(typeahead: any, name: string, required: boolean) {
  const typeaheadInput =
    ReactDOM.findDOMNode(typeahead.getInstance()).querySelector(`input[name=${name}]`)
  typeaheadInput.setAttribute('id', name)

  if (required) {
    typeaheadInput.setAttribute('required', 'true')
  }
}
