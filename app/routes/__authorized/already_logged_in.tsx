import { useEffect } from "react";

import { message } from "antd";

export default function Already() {
  useEffect(() => {
    message.info("You are already logged in.");
  }, []);
}
