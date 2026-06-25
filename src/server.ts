import app from "./app";

const PORT =process.env.PORT || 5000;
async function main (){
  try {
    app.listen(PORT,()=>{
    console.log(`server id running pn port ${PORT}`)
    })
  } catch (error) {
    console.error("Error staring yhe server",error);
    process.exit(1);
  }
}
main();