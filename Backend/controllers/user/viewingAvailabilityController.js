const { ViewingAvailability } = require('../../models');

async function createViewingAvailability(req, res) {
    const availabilityData = req.body;
    try {
        const createdAvailability = await ViewingAvailability.create(availabilityData);
        res.json(createdAvailability);
    } catch (error) {
        console.error("Error creating viewing availability:", error);
        res.status(500).json({ error: "Error creating viewing availability" });
    }
}

async function getViewingAvailabilityById(req, res) {
    const availabilityId = req.params.availabilityId;

    try {
        const availability = await ViewingAvailability.findByPk(availabilityId);

        if (!availability) {
            return res.status(404).json({ error: 'Viewing availability not found' });
        }

        res.json(availability);
    } catch (error) {
        console.error('Error fetching viewing availability:', error);
        res.status(500).json({ error: 'Error fetching viewing availability' });
    }
}

async function updateViewingAvailability(req, res) {
    const availabilityId = req.params.availabilityId;
    const updatedAvailabilityData = req.body;

    try {
        const availability = await ViewingAvailability.findByPk(availabilityId);

        if (!availability) {
            return res.status(404).json({ error: 'Viewing availability not found' });
        }

        await availability.update(updatedAvailabilityData);

        res.json(availability);
    } catch (error) {
        console.error('Error updating viewing availability:', error);
        res.status(500).json({ error: 'Error updating viewing availability' });
    }
}

async function deleteViewingAvailability(req, res) {
    const availabilityId = req.params.availabilityId;

    try {
        const availability = await ViewingAvailability.findByPk(availabilityId);

        if (!availability) {
            return res.status(404).json({ error: 'Viewing availability not found' });
        }

        await availability.destroy();

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting viewing availability:', error);
        res.status(500).json({ error: 'Error deleting viewing availability' });
    }
}

module.exports = {
    createViewingAvailability,
    getViewingAvailabilityById,
    updateViewingAvailability,
    deleteViewingAvailability,
};
