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

scp -i jamong-key.pem -r client/dist/* ec2-user@13.209.7.247:/home/ec2-user/

ssh -i jamong-key.pem ec2-user@13.209.7.247 "sudo cp -r /home/ec2-user/* /usr/share/nginx/html/"

echo =========================
echo 배포 완료
echo =========================

pause