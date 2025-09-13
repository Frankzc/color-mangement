import os
import datetime
import glob

# 项目根目录（脚本所在目录）
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# 要保留的版本数量
KEEP_LATEST = 4

# 输出文件名（带时间戳）
timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
OUTPUT_FILE = os.path.join(ROOT_DIR, f"project_context_{timestamp}.txt")

# 包含的文件类型
INCLUDE_EXT = [".vue", ".js", ".ts", ".scss", ".css", ".html"]

# 排除的文件夹
EXCLUDE_DIRS = {"node_modules", ".git", "dist", ".cache"}

# 排除的文件扩展名
EXCLUDE_EXT = {".md", ".log", ".txt"}  # 排除 txt

def should_include(file_path):
    _, ext = os.path.splitext(file_path)
    if ext.lower() in EXCLUDE_EXT:
        return False
    return ext.lower() in INCLUDE_EXT

# 写入文件
with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
    for root, dirs, files in os.walk(ROOT_DIR):
        # 排除目录
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

        for filename in files:
            file_path = os.path.join(root, filename)
            rel_path = os.path.relpath(file_path, ROOT_DIR)

            if should_include(file_path):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                except Exception as e:
                    content = f"<<无法读取: {e}>>"

                outfile.write(f"\n\n=== FILE: {rel_path} ===\n")
                outfile.write(content)

print(f"✅ 整合完成，输出文件：{OUTPUT_FILE}")

# 清理旧文件，只保留最新 N 个
all_versions = sorted(
    glob.glob(os.path.join(ROOT_DIR, "project_context_*.txt")),
    key=os.path.getmtime,
    reverse=True
)

if len(all_versions) > KEEP_LATEST:
    old_files = all_versions[KEEP_LATEST:]
    for f in old_files:
        try:
            os.remove(f)
            print(f"🗑️ 已删除旧版本: {f}")
        except Exception as e:
            print(f"⚠️ 删除失败 {f}: {e}")
