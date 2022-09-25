# 🚀 Memory heap command

```
sudo NODE_ENV=production NODE_OPTIONS=--max_old_space_size=2048 yarn build
```

# Before deploy
add custom cloudflare page rule under cache level select "bypass" 
```
api.les-experts.tn/* Cache Level: Bypass
```
