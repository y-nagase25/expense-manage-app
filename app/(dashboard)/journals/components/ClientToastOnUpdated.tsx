"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";

const ClientToastOnUpdated = () => {
    const params = useSearchParams();
    const { showToast } = useToast();

    useEffect(() => {
        if (params.get("updated") === "1") {
            showToast("success", "更新しました", "仕訳の更新が完了しました");
        } else if (params.get("updated") === "0") {
            showToast("error", "エラー", "エラーが発生しました");
        }
    }, [params, showToast]);

    return null;
}

export default ClientToastOnUpdated;
