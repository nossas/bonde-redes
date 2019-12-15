docker build -t nossas/match-voluntarios . && \
docker tag nossas/match-voluntarios nossas/match-voluntarios:search-msr && \
docker push nossas/match-voluntarios:search-msr