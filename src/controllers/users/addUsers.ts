import { Request, Response } from "express";
import prisma from "../../helper/databaseConnection";
import bcrypt from "bcrypt";
import { AddLogs } from "../apiLogs/addLogs";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";
import { GenerateFourDigitKey } from "../../helper/generateFourDigitKey";
import { getMaxDateTime } from "../../helper/getMaxDateTime";
import { SendEmailVerifyKey } from "../../helper/sendEmailVerifyKey";
export async function AddUser(req: Request, res: Response) {
  const { fname, lname, age, email, password, gender } = req.body;
  const isVerified = false;
  const generatedKey = String(GenerateFourDigitKey());
  const maxDateLimit = getMaxDateTime();
  try {
    const hashPassword = await bcrypt.hash(password, 5);
    const result = await prisma.user.create({
      data: {
        fname: fname,
        lname: lname,
        age: age,
        email: email,
        password: hashPassword,
        gender: gender,
        isVerified: isVerified,
        category: {
          create: {
            title: "general",
            description: "general",
            isCommon: false,
          },
        },
        type: {
          createMany: {
            data: [
              {
                title: "income",
                description: "income",
                isCommon: false,
              },
              {
                title: "expense",
                description: "expense",
                isCommon: false,
              },
            ],
          },
        },
        verify: {
          create: {
            key: generatedKey,
            limitTime: maxDateLimit,
          },
        },
        notifications: {
          create: {
            title: "Welcome",
            description: `Welcome ${fname} ${lname}, to expense tracker app.`,
          },
        },
      },
    });
    try {
      const response = SendEmailVerifyKey(
        email,
        generatedKey,
        maxDateLimit,
        fname,
        lname
      );
      return res
        .status(200)
        .json(
          GenerateSuccessJSON(
            "Created user successfully with email service ",
            result
          )
        );
    } catch (e) {
      return res
        .status(200)
        .json(
          GenerateSuccessJSON(
            "Created user successfully without email service " + e,
            result
          )
        );
    }
  } catch (e) {
    AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
  }
}
