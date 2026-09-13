@echo off

cd /d C:\Projects\jamong-environment

echo =========================
echo React build 시작
echo =========================

cd client
call npm run build

cd ..

echo =========================
echo EC2 서버 업로드
echo =========================

ssh -i jamong-key.pem ec2-user@3.37.35.203 "rm -rf /home/ec2-user/jamong-environment/client/dist && mkdir -p /home/ec2-user/jamong-environment/client/dist"

scp -i jamong-key.pem -r client/dist/* ec2-user@3.37.35.203:/home/ec2-user/jamong-environment/client/dist/

echo =========================
echo 배포 완료
echo =========================

pause