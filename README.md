# joi-example
A simple validation example for a use-case of [joi](https://github.com/hapijs/joi)

The popular HAPI validation plugin is often used for client-facing validation, however it's messages are not user friendly and overriding them is complex or requires the use of third party plugins.

This project aims to provide a simple method to add custom messages to your project using a structured approach.

## Usage
- Import `server/helpers/joi-messages` in your NodeJS application.
- In your model add the `validate(data)` method
- Call your model's `validate` method to validate the submitted data against the model's schema.

## Reference
- The structure of the `type` may be found on Joi's `language` file [here](https://github.com/hapijs/joi/blob/master/lib/language.js)

## Demo
- To run the demo, run the following command in the project's root directory:
```
    gulp watch
```
