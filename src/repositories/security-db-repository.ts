import {RefreshTokensMeta} from "../types/types";
import {refreshTokensCollection} from "../db/db";

export const securityRepository ={
    async getAllSessions(deviceId : string) : Promise<RefreshTokensMeta[] | null> {
        return refreshTokensCollection
            .find({deviceId}, {projection : {_id : 0}})
            .toArray()
    },

    async deleteAllSessions(deviceId : string) : Promise<boolean> {
        const result = await refreshTokensCollection
            .deleteMany({deviceId})
        return result.deletedCount > 0
    },
    async deleteOneSessions(deviceId : string) : Promise<boolean> {
        const result = await refreshTokensCollection
            .deleteOne({deviceId})
        return result.deletedCount === 1
    },
    async createNewSession(refreshTokensMeta : RefreshTokensMeta) : Promise<boolean> {
        await refreshTokensCollection
            .insertOne({
                userId : refreshTokensMeta.userId,
                ip: refreshTokensMeta.ip,
                title: refreshTokensMeta.title,
                lastActiveDate: refreshTokensMeta.lastActiveDate,
                deviceId: refreshTokensMeta.deviceId
            });
        const createdSession = await this.findSessionByIp(refreshTokensMeta.ip);
        if (createdSession) return true;
        return false;


    },
    async findSessionByIp(ip : string) : Promise<RefreshTokensMeta | null> {
        return refreshTokensCollection
            .findOne({ip: ip})
    }


}