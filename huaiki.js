let Vimeo = require("vimeo").Vimeo;
const fs = require("fs");
import axios from "axios";

const downloadFile = async (url, path, nameFile) => {
  let fileSaved = await new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      responseType: "stream",
    })
      .then((response) => {
        response.data
          .pipe(fs.createWriteStream(`${path}/${nameFile}`))
          .on("finish", () => {
            resolve("okkkk");
          });
      })
      .catch((error) => {
        console.log(error);
        reject(url);
      });
  });
  return fileSaved;
};

const downloadVimeo = async () => {
  let client = new Vimeo(
    "746fe6ec6f457065cc6baff68d184bb3a00807bd",
    "zh+RzdT/BJchez8NQlqR0kw9kNpRJSsYLbZTDlNqwe7SKEsTzWzaG2c12mD9+ofaVmGv1xOnvvsgvqDlw6d11mW+8ZGQFF0btCnmItDaKg4U8z4As9bPOWuFFAfzdckn",
    "c2d9c98df9e12c879fab8e044d0f8236"
  );
  let courses = await fs.readFileSync("huayki2.json");
  courses = JSON.parse(courses);
  let coursesDownloaded = await fs.readFileSync("huayki2Saved.json");
  coursesDownloaded = JSON.parse(coursesDownloaded);
  for (const course of courses) {
    let { vimeo, idCourse, idTopics, nombreTopic } = course;
    if (!coursesDownloaded[`${idCourse}_${idTopics}`]) {
      let idVideo = vimeo.split("/")[3];
      let video = await new Promise((resolve, reject) => {
        client.request(
          {
            method: "GET",
            path: `/me/videos/${idVideo}`,
          },
          (error, body, status_code, headers) => {
            if (error) {
              reject(error);
            }
            let { download } = body;
            let res = download.find((item) => {
              return item.public_name === "540p";
            });
            console.log(res);
            resolve(res);
          }
        );
      });
      console.log('video',video);
      let videoSaved = await downloadFile(
        video.link,
        "./videos_huaiki",
        `${idCourse}_${idTopics}_${nombreTopic
          .replace(/ /g, "-")
          .toLowerCase()}.mp4`
      );
      console.log(videoSaved);
      if (videoSaved === "okkkk") {
        let coursesSaved = await fs.readFileSync("huayki2Saved.json");
        coursesSaved = JSON.parse(coursesSaved);
        coursesSaved = {...coursesSaved,[`${idCourse}_${idTopics}`]:true};
        await fs.writeFileSync(
          "huayki2Saved.json",
          JSON.stringify(coursesSaved),
          "utf8"
        );
      }
    }
  }
};

downloadVimeo();