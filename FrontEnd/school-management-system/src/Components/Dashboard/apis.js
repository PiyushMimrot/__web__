import axios from "axios";
import { SERVER } from "../../config";

/**
 * The function `getAllClassApi` makes an HTTP GET request to the server to retrieve all classes and
 * returns the response data or an error message.
 * @returns the data received from the API call if the request is successful. If there is an error, it
 * is returning the error response data.
 */
export const getAllClassApi = async () => {
  try {
    const response = await axios.get(`${SERVER}/classes/allClasses`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getClassSectionsApi` is an asynchronous function that makes an API call to retrieve
 * class sections based on a given class ID.
 * @param classid - The `classid` parameter is the ID of the class for which you want to retrieve the
 * sections.
 * @returns an object with two properties: "data" and "status". The "data" property contains the
 * response data from the API call, and the "status" property contains the HTTP status code of the
 * response.
 */
export const getClassSectionsApi = async (classid) => {
  try {
    const response = await axios.get(
      `${SERVER}/section/getSectionClass/${classid}`,
      {
        withCredentials: true,
      }
    );
    return { data: response.data, status: response.status };
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getSectionCourseProgressApi` is an asynchronous function that makes an API call to
 * retrieve the course progress for a specific section.
 * @param sectionid - The sectionid parameter is the unique identifier for a specific section of a
 * course. It is used to retrieve the course progress data for that particular section.
 * @returns an object with two properties: "data" and "status". The "data" property contains the
 * response data from the API call, and the "status" property contains the HTTP status code of the
 * response.
 */
export const getSectionCourseProgressApi = async (sectionid) => {
  try {
    const response = await axios.get(
      `${SERVER}/dashboard/classprogress/${sectionid}`,
      {
        withCredentials: true,
      }
    );
    return { data: response.data, status: response.status };
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getAllStaffsApi` makes an API call to retrieve all active staff members.
 * @returns the data received from the API call if the request is successful. If there is an error, it
 * will return the error response data.
 */
export const getAllStaffsApi = async () => {
  try {
    const response = await axios.get(`${SERVER}/staffmanage/activestaffs`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getTotalClassesSubjectWise` makes a POST request to a server endpoint to get the total
 * number of classes subject-wise.
 * @param body - The `body` parameter is an object that contains the data to be sent in the request
 * body. It is used to pass any necessary information to the server for processing.
 * @returns the data from the response if the request is successful. If there is an error, it is
 * returning the error response data.
 */
export const getTotalClassesSubjectWise = async (body) => {
  try {
    const response = await axios.post(
      `${SERVER}/dashboard/total_classes`,
      body,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

/**
 * The function `getClassExamsCout` is an asynchronous function that makes a GET request to a server
 * endpoint to retrieve the count of exams for a specific class.
 * @param classid - The `classid` parameter is the identifier for a specific class. It is used to
 * retrieve the exam count for that particular class.
 * @returns the data received from the API response if the request is successful. If there is an error,
 * it is returning the error response data.
 */
export const getClassExamsCout = async (classid) => {
  try {
    const response = await axios.get(
      `${SERVER}/dashboard/classwiseexamcount/${classid}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAssigmentsCount = async (classid, sectionid) => {
  try {
    const response = await axios.post(
      `${SERVER}/dashboard/assigmentscount`,
      { classid, sectionid },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getTeacherAssigmentsCount = async (classid, teacher_id = null) => {
  try {
    let url = teacher_id ? `${classid}?teacher_id=${teacher_id}` : classid;
    const response = await axios.get(
      `${SERVER}/dashboard/teacher/assignements/${url}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
