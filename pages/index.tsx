import StudentCard from "@components/StudentCard";
import Image from "next/image";
import useSWR from "swr";

type Sim = { sim: number; studentId: string };

interface IFackcheckData {
  sim: Sim[];
  studentId: string;
  max_sim: number;
}

export default function Show() {
  const { data, error } = useSWR<IFackcheckData>(
    "https://facecheck.run-asia-northeast1.goorm.site/detection"
  );

  return (
    <div className="lg:flex lg:h-screen lg:w-full lg:items-center lg:justify-center lg:px-5">
      <div className="fixed -top-14 z-10 w-full md:-top-24 lg:relative lg:top-0 lg:max-w-2xl lg:rounded-3xl">
        <div className="h-[320px] w-full bg-white md:h-[500px] lg:h-[60vh] lg:min-h-[770px] lg:overflow-hidden lg:rounded-t-3xl">
          {data?.studentId ? (
            <Image
              src={`https://facecheck.run-asia-northeast1.goorm.site/image?student_id=${data.studentId}`}
              alt=""
              width={630}
              height={630}
              className="h-full w-full object-cover object-top"
            />
          ) : null}
        </div>
        <div className="flex h-20 w-full flex-col items-center justify-center rounded-b-md bg-white shadow-lg">
          <span className="text-xl">
            {data?.studentId
              ? `${data.studentId}`
              : "Not Found Matched Student..."}
          </span>
          <span className="text-sm text-gray-600">
            {data?.max_sim ? data?.max_sim.toFixed(2) : ""}%
          </span>
        </div>
      </div>
      <div className="mt-[320px] py-3 md:mt-[470px] lg:mt-0">
        <div className="mt-5 flex flex-col gap-5 px-7 sm:px-9 lg:mt-0 ">
          {data?.sim
            ? data?.sim.map((item, index) => (
                <div key={index}>
                  <StudentCard
                    stuNum={item.studentId + ""}
                    accuracy={item.sim}
                    isAcruccyMilestone={true}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
