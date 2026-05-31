import subprocess
import sys
import os


def install_libs(file_path='requirements.txt'):
    if not os.path.exists(file_path):
        print(f"Không tìm thấy: {file_path}")
        return

    subprocess.check_call([
        sys.executable, "-m", "pip", "install",
        "-r", file_path,
        "--quiet",
        "--disable-pip-version-check",
    ])
    try:
        print("Checking requirements finished...")
    except subprocess.CalledProcessError:
        print("Cài đặt thất bại. Vui lòng kiểm tra lại file requirements.txt")
        sys.exit(1)


# test bằng console: python libs-setup
if __name__ == "__main__":
    install_libs()
