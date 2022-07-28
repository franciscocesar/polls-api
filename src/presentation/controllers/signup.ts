import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller, httpRequest, HttpResponse, EmailValidator } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: httpRequest): HttpResponse {
    try {
      const requiredFirelds = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFirelds) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
