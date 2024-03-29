import Image from "next/image";
import { useEffect, useState } from "react";
import { UseFormRegister, useForm } from "react-hook-form";

interface IForm {
  picrure: FileList;
}

interface IProps {
  isUpload?: boolean;
  stuNum?: string;
  accuracy?: number;
  isAcruccyMilestone?: boolean;
}

export default function StudentCard(props: IProps) {
  const { register, handleSubmit, watch } = useForm<IForm>();
  const [picrurePreview, setPicrurePreview] = useState("");
  const [uploadError, setUploadError] = useState<String | null>(null);
  const [stuNum, setStunum] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const onValid = ({ picrure }: IForm) => {
    if (picrure) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(picrure[0]);
      fileReader.onload = () => {
        const base64 = fileReader.result
          ?.toString()
          .split("data:image/jpeg;base64,")[1];
        fetch("https://facecheck.run-asia-northeast1.goorm.site/register", {
          method: "POST",
          mode: "cors",
          headers: { "Content-type": "application/json;charset=utf-8" },
          body: JSON.stringify({
            encodedImage: base64,
            studentID: stuNum + "",
          }),
        }).then(async (res) => {
          if (res.status == 200) {
            const { msg } = await res.json();
            if (msg === "얼굴이 정상적으로 등록되었습니다") {
              setIsUploaded(true);
            }
          }
        });
      };
    }
  };

  const picrure = watch("picrure");

  useEffect(() => {
    if (picrure && picrure.length > 0) {
      if (!picrure[0].type.includes("image")) {
        setUploadError("this file is not image");
        return;
      }
      const file = picrure[0];
      // Memory => url
      setPicrurePreview(URL.createObjectURL(file));
    }
  }, [picrure]);

  useEffect(() => {
    if (!props.stuNum) {
      const time = new Date().getTime() + "";
      setStunum(`567${time.slice(9, 13)}`);
    } else {
      setStunum(props.stuNum);
      setPicrurePreview(
        `https://facecheck.run-asia-northeast1.goorm.site/image?student_id=${props.stuNum}`
      );
      setIsUploaded(true);
    }
  }, [props]);

  console.log(picrurePreview);

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className="relative rounded-2xl bg-white px-8 py-7 shadow-xl ">
        {props.isUpload ? null : (
          <>
            {props.isAcruccyMilestone ? (
              <>
                <div className="absolute -right-3 flex h-9 w-20 items-center justify-center rounded-tl-md rounded-bl-2xl rounded-tr-2xl bg-red-500 text-sm font-medium text-white sm:w-24">
                  <span>{props.accuracy}%</span>
                </div>
                <div className="absolute -right-3 top-[64px] h-5 w-3 border-b-[20px] border-l-[12px] border-b-transparent border-l-red-300"></div>
              </>
            ) : (
              <>
                <div className="absolute -right-3 flex h-9 w-24 items-center justify-center rounded-md bg-red-500 text-sm font-medium text-white">
                  <span>{props.accuracy}%</span>
                </div>
              </>
            )}
          </>
        )}
        <div className="flex gap-5">
          <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-inner ring-1 ring-stone-50">
            {props.isUpload ? (
              <div className="relative h-full w-full">
                <input
                  type="file"
                  {...register("picrure")}
                  disabled={isUploaded}
                  className="absolute z-10 h-full w-full opacity-0"
                />
              </div>
            ) : null}
            <div className="absolute top-0 flex h-full w-full items-center justify-center">
              {picrurePreview ? (
                <Image
                  src={picrurePreview}
                  width={430}
                  height={430}
                  alt="preview picrure"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="rounded-full border-2 border-dashed p-5 text-center text-sm text-gray-500">
                  Add <br />
                  Image
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between border-l pl-5">
            <div className="flex w-[35vw] flex-col sm:w-[50vw] md:w-[398px]">
              <span className="mb-1.5 text-lg">{stuNum ? stuNum : ""}</span>
              <span className="text-xs text-gray-500">Description</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2">
                <span className="rounded-xl bg-indigo-500 px-2.5 py-1 text-xs text-white">
                  # 컴퓨터 공학과
                </span>
                <span className="rounded-xl bg-teal-500 px-2.5 py-1 text-xs text-white">
                  #
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {props.isUpload ? (
        <div className="mt-24 flex w-full justify-center">
          <button
            disabled={isUploaded}
            className={`rounded-xl ${
              isUploaded
                ? "w-36 bg-slate-500 text-gray-400"
                : "w-32 bg-blue-500 hover:bg-teal-500 focus:bg-red-500 active:bg-yellow-500 "
            } p-3 text-center text-white `}
          >
            <span>{isUploaded ? "Checkout Done ✅" : "Checkout"}</span>
          </button>
        </div>
      ) : null}
    </form>
  );
}
