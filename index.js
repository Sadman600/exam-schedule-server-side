const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.m43m8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const scheduleCollection = client.db("exam_schedule").collection("schedule");

        app.get('/examSchedule', async (req, res) => {
            const schedules = await scheduleCollection.find().toArray();
            res.send(schedules);
        });
        app.post('/examSchedule', async (req, res) => {
            const schedule = req.body;
            const result = await scheduleCollection.insertOne(schedule);
            res.send(result);
        });

        app.put('/examSchedule/:id', async (req, res) => {
            const id = req.params.id;
            const schedule = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    examName: schedule.examName,
                    examCategory: schedule.examCategory,
                    examStatus: schedule.examStatus,
                    examStartDate: schedule.examStartDate,
                    examEndDate: schedule.examEndDate,
                    examStartTime: schedule.examStartTime,
                    examEndTime: schedule.examEndTime,
                    resultPublishDate: schedule.resultPublishDate,
                    resultPublishTime: schedule.resultPublishTime,
                    day: schedule.day,
                    hour: schedule.hour,
                    minute: schedule.minute,
                    questionMark: schedule.questionMark,
                    negativeMark: schedule.negativeMark,
                    liveExamCharge: schedule.liveExamCharge,
                    archiveExamCharge: schedule.archiveExamCharge,
                    remark: schedule.remark,
                },
            };
            const result = await scheduleCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete('/examSchedule/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await scheduleCollection.deleteOne(query);
            res.send(result);
        });


    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Exam Schedule Server!');
})

app.listen(port, () => {
    console.log(`Exam schedule listening on port ${port}`);
})