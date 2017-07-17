import Joi from 'joi';
import JoiMessages from '../helpers/joi-messages';

export default class Form {
    static get schema() {
        return Joi.object().keys({
            firstname: Joi.string().required().label('First name'),
            password: Joi.string().regex(/^[a-zA-Z0-9]{8,30}$/).label('Password'),
            email: Joi.string().email().label('Email')
        });
    }

    static get validationMessages() {
        return {
            password: {
                'any.empty': '{{key}} is required'
            },
            firstname: {
                'any.empty': '{{key}} is required'
            }
        };
    }

    validate(data) {
        // promisify the validation method
        return new Promise((resolve, reject) => {
            Joi.validate(data, Form.schema, { abortEarly: false }, (errors, values) => {
                // transform the error messages into a user-friendly variant
                let errorMessages = JoiMessages.transform(errors.details, values, Form.validationMessages, { singleErrorPerField: true });
                resolve(errorMessages, values);
            });
        });
    }
}
