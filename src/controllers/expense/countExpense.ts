import { Request, Response } from "express";
import { AddLogs } from "../apiLogs/addLogs";
import prisma from "../../helper/databaseConnection";
import { GenerateSuccessJSON } from "../../helper/generateSuccessJson";

export async function CountExpense(req: Request, res: Response) {
  const { id } = req.params;
  if (id) {
    try {
      let result = await prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          userId: id,
        },
      });

      res
        .status(200)
        .json(GenerateSuccessJSON("Successfully added expense", result));
    } catch (e) {
      AddLogs(req.url, 400, JSON.stringify(req.body), e, res);
    }
  } else {
    AddLogs(req.url, 400, JSON.stringify(req.body), "No id found", res);
  }
}
