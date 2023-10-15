const { Schedule } = require('../../models');

async function createSchedule(req, res) {
    const scheduleData = req.body;
    try {
        const createdSchedule = await Schedule.create(scheduleData);
        res.json(createdSchedule);
    } catch (error) {
        console.error("Error creating schedule:", error);
        res.status(500).json({ error: "Error creating schedule" });
    }
}

async function getScheduleById(req, res) {
    const scheduleId = req.params.scheduleId;

    try {
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        res.json(schedule);
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ error: 'Error fetching schedule' });
    }
}

async function updateSchedule(req, res) {
    const scheduleId = req.params.scheduleId;
    const updatedScheduleData = req.body;

    try {
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        await schedule.update(updatedScheduleData);

        res.json(schedule);
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ error: 'Error updating schedule' });
    }
}

async function deleteSchedule(req, res) {
    const scheduleId = req.params.scheduleId;

    try {
        const schedule = await Schedule.findByPk(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        await schedule.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'Error deleting schedule' });
    }
}

module.exports = {
    createSchedule,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
};
