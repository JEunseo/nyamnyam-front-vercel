
export async function save(participant: ParticipantModel): Promise<any | {status: number}> {
    try {
        const participantModel = {
            nickname: participant.nickname
        }
        const response = await fetch('http://localhost:8080/participants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(participantModel)
        });
        const data: any = await response.json();
        return data;

    } catch (e) {
        console.log('There has been a problem with your fetch operation', e);
        return {status: 500 };
    }
}