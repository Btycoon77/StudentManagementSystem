
const responseMessage = (res: any, statusCode: number, data: any, message: string, method: string) => {
    return res.status(statusCode || 200).json({
      message: message?.length ? message : "default message",
      method: method.toUpperCase(),
      data: Object.keys(data).length ? data : [],
      statusCode: statusCode || 200,
    });
  };
  
  export { responseMessage };