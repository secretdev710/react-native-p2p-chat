mongoose.connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err : any) => console.log(err));