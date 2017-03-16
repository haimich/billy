import * as ReactDOM from 'react-dom'

export function addFormValidation(inputs: any[], revalidate: (input: any) => void) {
  for (let input of inputs) {
    input.addEventListener('input', event => revalidate(event.target))

    input.addEventListener('invalid', (event) => {
      const input: any = event.target;
      addHasError(input)
    })
  }
}

export function resetFormValidationErrors(inputs: any[]) {
  for (let input of inputs) {
    removeHasError(input);
  }
}

function removeHasError(input: any) {
  let group = input.closest('.form-group') || input.closest('.input-group')
  
  if (group != null) {
    group.classList.remove('has-error')
  }
}

function addHasError(input: any) {
  let group = input.closest('.form-group') || input.closest('.input-group')
  
  if (group != null) {
    group.classList.add('has-error')
  }
}

export function getInputs(component) {
  return [...ReactDOM.findDOMNode(component).querySelectorAll('input,textarea')]
}

export function revalidateInput(input: any) {
  removeHasError(input)
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
