import axios from "axios";
import { SERVER } from "../../../config";

export const AddNewExamListApi = async (details) => {
  try {
    const options = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    let response = await axios.post(`${SERVER}/examlist`, details, options);
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: error.response.status,
      error: error.response.data.error,
    };
  }
};
