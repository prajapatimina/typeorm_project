class CustomError extends Error{
    statusCode: string;
    errorMessage : string;

    constructor(
        public status: string = '500',
        public message : string = 'Something went wrong.')
    {
        super(message);
        this.statusCode = status;
        this.errorMessage = message;
    }
}
export default CustomError;