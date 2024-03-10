export const LOGIN_WARNING = {
    usernameMaxLimit: "username should be less than 16 characters!",
    passwordMaxLimit: "password should be less than 25 characters!",
    sessionExpired: "Session Expired! Please login again!",
}

export const ADMIN_CENTER_WARNING = {
    passwordMaxLimit: "password should be less than 25 characters!",
    passwordsNotMatching: "password confirmation is not matching with the new password entered!",
    suPasswordMaxLimit: "super user password should be less than 25 characters!",
    invalidSuPassword: "Invalid Super user password!",
    wrongPassword: "Invalid password format! Please try again with a valid password.",
    somethingWentWrong: "Something went wrong! Please try again.",
}

export const INFORM_MODAL_MESSAGE = {
    invalidSearchQuery: "Please check your search term. It's of invalid form!",
    passwordResetSuccess: "Password reset successful!",
    importNewBooks: `You are about to import <span class="text-warning">NUMBER_OF</span> books. Are we good to go?`,
    importNewBooksError: `Error importing new books :(`,
    importMaxLimit: `Only 10 books can be imported at a time!`,
    importNewBooksSuccess: `Books imported successfuly!`,
    readerOperationSuccess: `Operation on Reader successful! `,
    readerOperationFailuer: `Operation on Reader was unsuccessful!<br>Make sure you have provided a unique mobile/email.`,
}

export const INFORM_MODAL_HEADER = {
    invalidSearchQuery: `<span class="mdi mdi-alert-circle"></span> Oops!`,
    passwordResetSuccess: `<span class="mdi mdi-check-circle"></span> Success`,
    importNewBooks: `Import Books`,
    importNewBooksError: `<span class="mdi mdi-alert-circle"></span> Failure`,
    importMaxLimit: `<span class="mdi mdi-alert-circle"></span> Max Limit Exceeded!`,
    importNewBooksSuccess: `<span class="mdi mdi-check-circle"></span> Success`,
    readerOperationSuccess: `<span class="mdi mdi-check-circle"></span> Success`,
    readerOperationFailuer: `<span class="mdi mdi-alert-circle"></span> Failure`,
}

export const CUSTOMER_CENTER_WARNING = {
    invalidEmail: "Invalid email ID",
    invalidPhone: "Invalid Phone number",
    invalidUsername: "Username should be between 3 to 15 characters!",
}