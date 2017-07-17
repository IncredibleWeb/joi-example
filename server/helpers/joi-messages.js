const defaultOptions = {
    singleErrorPerField: false
};

export default class JoiMessages {

    static transform(errors, values, validationMessages, options) {
        validationMessages = validationMessages || {};
        options = Object.assign(defaultOptions, options);

        let userFriendlyMessages = [];
        let fields = [];

        for (let i = errors.length - 1; i >= 0; i--) {
            let error = errors[i];

            // only show a single error per field
            if (options.singleErrorPerField && fields.indexOf(error.path) > -1) {
                continue;
            }
            // keep track of the fields which have already been validated
            fields.push(error.path);

            if (validationMessages[error.path]) {
                // check if there is a custom error
                let errorMessage = validationMessages[error.path][error.type];
                if (errorMessage) {
                    // replace context variables
                    for (let property in error.context) {
                        if (error.context.hasOwnProperty(property)) {
                            let regex = new RegExp(`{{${property}}}`, 'g');
                            errorMessage = errorMessage.replace(regex, error.context[property]);
                        }
                    }
                    // write a custom user-friendly message
                    userFriendlyMessages.push(errorMessage);
                } else {
                    // fallback to the default implementation
                    userFriendlyMessages.push(error.message);
                }
            } else {
                // fallback to the default implementation
                userFriendlyMessages.push(error.message);
            }
        }

        return userFriendlyMessages;
    }
}
