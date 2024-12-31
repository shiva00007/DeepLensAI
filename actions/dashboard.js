"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export const createAccount = async (data) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.findUnique({
      where: {
        clerkUserId: userId,
      },
    });
    if (!user) throw new Error("User Not Found");

    // convert balance into float
    const balanceFloat = parseFloat(data.balance);

    if (isNaN(balanceFloat)) {
      throw new Error("Invalid Balance Amount");
    }

    //to check the exsiting account

    const exsistingAccount = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefalut =
      exsistingAccount.length === 0 ? true : data.isDefault;

    if (shouldBeDefalut) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const newAccount = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefalut,
      },
    });
    const serializedAccount = serializeDecimal(newAccount);
    revalidatePath("/dashboard");
    return { succuess: true, data: serializedAccount };
  } catch (error) {
    console.log(error.message);
  }
};
