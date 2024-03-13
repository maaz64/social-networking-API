module.exports.ApiResponse = (success, data, message)=>{
    return{success, message, data}
}

// class ApiResponse {

//     constructor(success,data,message){
//         this.success - success,
//         this.data = data,
//         this.message = message
//     }
// }