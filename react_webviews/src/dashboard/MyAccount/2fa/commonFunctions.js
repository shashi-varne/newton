import Api from "utils/api";
import { storageService, isEmpty } from "utils/validators";
import toast from "../../../common/ui/Toast";
import { navigate as navigateFunc } from "utils/functions";

const genericErrorMessage = "Something went wrong!";
export async function initializeComponentFunctions() {
    this.navigate = navigateFunc.bind(this.props);
  }