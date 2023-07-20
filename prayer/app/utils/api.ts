import axios from 'axios';

interface PrayerTimesResponse {
    data: {
        timings: Record<string, string>;
    };
}

const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
        const response = await axios.get<PrayerTimesResponse>(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );

        return response.data.data.timings;
    } catch (error) {
        throw new Error('Failed to fetch prayer times.');
    }
};

export default fetchPrayerTimes;
