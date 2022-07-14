import { IListing, IListingGetWithoutAuthorResponse } from "./listing.model";
import { IMessage } from "./message.model";

export interface IUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    currentListings?: IListing[];
    bookmarkedListings?: string[];
    messages?: IMessage[];
    roleId: number;
    roleName?: string;
}
export interface AuthorGetResponse {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateCreated: string;
    listings?: IListingGetWithoutAuthorResponse[]
}

export type IUser = IUserResponse;
export type IUsers = IUserResponse[];
