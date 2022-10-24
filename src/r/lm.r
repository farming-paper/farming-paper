x <- c(1, 1.4, 1.6, 2, 2.2, 2.4, 3, 3.3, 3.6)
y <- c(15, 13, 13, 12, 11, 10.5, 10, 9, 8)
result <- lm(y ~ x)
summary(result)
print("-----------")
result
print("-----------")
anova(result)
